import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageActivitylog } from './manage-activitylog';

describe('ManageActivitylog', () => {
  let component: ManageActivitylog;
  let fixture: ComponentFixture<ManageActivitylog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageActivitylog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageActivitylog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
