import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLandingpage } from './user-landingpage';

describe('UserLandingpage', () => {
  let component: UserLandingpage;
  let fixture: ComponentFixture<UserLandingpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLandingpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLandingpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
